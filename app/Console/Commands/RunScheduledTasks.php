<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RunScheduledTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:run-scheduled-tasks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $this->info('Running scheduled tasks...');

    }
}
