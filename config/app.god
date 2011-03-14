# Use a trailing '/'
APP_ROOT = "/home/john/Doneski/"
RVM = "/usr/local/bin/rvm"
UNICORN = "/usr/local/bin/unicorn"

# The list of ports which our website is running on. We want to setup God monitoring for each of these ports as each port has a separate master unicorn process. In our case we're just going to use one port
%w{21000,22000}.each do |port|
  God.watch do |w|
    w.name = "doneski-#{port}"
    w.group = "doneski"
    w.log = "#{APP_ROOT}log/god.#{port}.log"
    w.interval = 30.seconds # default
    # Go into the website root before starting unicorn
    w.start = "cd #{APP_ROOT} && unicorn -l #{port} -c #{APP_ROOT}config/unicorn.#{port}.conf -E production"
    # -QUIT = graceful shutdown, waits for workers to finish their current request before finishing
    w.stop = "kill -QUIT `cat #{APP_ROOT}log/unicorn-master.#{port}.pid`"
    # -USR2 = reexecute the running binary. A separate QUIT should be sent to the original process once the child is verified to be up and running.
    w.restart = "kill -USR2 `cat #{APP_ROOT}log/unicorn-master.#{port}.pid`"
    w.start_grace = 10.seconds
    w.restart_grace = 10.seconds

    # User under which to run the process
    # w.uid = 'nobody'
    # w.gid = 'nogroup'
    
    # Cleanup the pid file (this is needed for processes running as a daemon)
    w.behavior(:clean_pid_file)

    # Conditions under which to start the process
    w.start_if do |start|
      start.condition(:process_running) do |c|
        c.interval = 5.seconds
        c.running = false
      end
    end
    
    # Conditions under which to restart the process
    w.restart_if do |restart|
      restart.condition(:memory_usage) do |c|
        c.above = 150.megabytes
        c.times = [3, 5] # 3 out of 5 intervals
      end
    
      restart.condition(:cpu_usage) do |c|
        c.above = 50.percent
        c.times = 5
      end
    end
    
    w.lifecycle do |on|
      on.condition(:flapping) do |c|
        c.to_state = [:start, :restart]
        c.times = 5
        c.within = 5.minute
        c.transition = :unmonitored
        c.retry_in = 10.minutes
        c.retry_times = 5
        c.retry_within = 2.hours
      end
    end
  end
end