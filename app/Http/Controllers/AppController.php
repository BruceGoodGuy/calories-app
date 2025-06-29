<?php

namespace App\Http\Controllers;

use Native\Laravel\Facades\App;
use Native\Laravel\Facades\Alert;
use Native\Laravel\Facades\Notification;


use Illuminate\Http\Request;

class AppController extends Controller
{
    //
    public function quit(Request $request)
    {
        App::quit();
    }

    public function relaunch(Request $request)
    {
        App::relaunch();
    }

    public function test(Request $request)
    {
        Notification::title('Hello from NativePHP')
    ->message('This is a detail message coming from your Laravel app.')
    ->show();
    }
}
