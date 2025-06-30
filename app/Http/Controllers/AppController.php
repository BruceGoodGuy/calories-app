<?php

namespace App\Http\Controllers;

use Native\Laravel\Facades\App;
use Native\Laravel\Facades\Alert;
use Native\Laravel\Facades\Notification;
use Native\Laravel\Dialog;



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

    public function import(Request $request)
    {
        $filePath = Dialog::new()
            ->title('Choose food dataset')
            ->filter('Documents', ['csv'])
            ->open();
        if ($filePath) {
            if (file_exists($filePath)) {
                $file = fopen($filePath, 'r');
                if (is_file($filePath)) {
                    fgetcsv($file); // Skip header
                } else {
                    return response()->json(['error' => 'Selected path is not a valid file'], 400);
                }
                $count = 0;
                while (($data = fgetcsv($file)) !== FALSE) {
                    $slug = $data[1] ? \Illuminate\Support\Str::slug($data[0]) : \Illuminate\Support\Str::slug($data[1]);
                    if (!\App\Models\Food::where('slug', $slug)->exists()) {
                        \App\Models\Food::create([
                            'name' => $data[0],
                            'slug' => $slug,
                            'protein_per_100g' => $data[2],
                            'fat_per_100g' => $data[3],
                            'carbs_per_100g' => $data[4],
                            'calories_per_100g' => $data[5],
                        ]);
                        $count++;
                    }
                }
                fclose($file);
                Alert::new()->title('Success')->type('info')
                    ->show('Import dataset successfully (total: ' . $count . ' items)');
            } else {
                Alert::new()->title('Error')->type('error')
                    ->show('File does not exist');
            }
        } else {
            Alert::new()->title('Error')->type('error')
                ->show('File does not exist');
        }
        App::relaunch();
    }

    public function test(Request $request)
    {
        Notification::title('Hello from NativePHP')
            ->message('This is a detail message coming from your Laravel app.')
            ->show();
    }
}
