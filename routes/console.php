<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Native\Laravel\Facades\Notification;



Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('seed:manual', function () {
    $this->call('native:db:seed', ['--class' => 'FoodsSeeder']);
})->describe('Manual DB seed workaround');

Schedule::call(function () {
    Notification::title('Hello from Calorie Tracker')
    ->message('It\'s time to log your meals!')
    ->show();
})->everyMinute();