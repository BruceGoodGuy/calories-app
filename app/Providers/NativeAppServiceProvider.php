<?php

namespace App\Providers;

use Native\Laravel\Facades\Window;
use Native\Laravel\Facades\MenuBar;
use Native\Laravel\Contracts\ProvidesPhpIni;
use Native\Laravel\Facades\Menu;
use Native\Laravel\Facades\App;


class NativeAppServiceProvider implements ProvidesPhpIni
{
    /**
     * Executed once the native application has been booted.
     * Use this method to open windows, register global shortcuts, etc.
     */
    public function boot(): void
    {
        App::badgeCount(5);
        $menus = Menu::make(
            Menu::route('settings', 'Settings', 'Ctrl+S'),
            Menu::route('tdee-calculator', 'Calculate TDEE', 'Ctrl+T'),
            Menu::route('app.relaunch', 'Relaunch', 'Ctrl+'),
            Menu::route('app.quit', 'Quit', 'Ctrl+W'),
        )->label('Calorie Tracker');
        // if (auth()->check()) {
        //     $menus = Menu::make(
        //         Menu::route('settings', 'Settings', 'Ctrl+S'),
        //         Menu::route('tdee-calculator', 'Calculate TDEE', 'Ctrl+T'),
        //         Menu::route('app.relaunch', 'Relaunch', 'Ctrl+'),
        //         Menu::route('app.quit', 'Quit', 'Ctrl+W'),
        //     )->label('Calorie Tracker');
        // } else {
        //     $menus = Menu::make(
        //         Menu::route('app.relaunch', 'Relaunch', 'Ctrl+'),
        //         Menu::route('app.quit', 'Quit', 'Ctrl+W'),
        //     )->label('Calorie Tracker');
        // }
        Menu::create(
            $menus,
            Menu::make(
                Menu::link('https://github.com/BruceGoodGuy/calories-app/tree/dev', 'Repository'),
                Menu::route('app.test', 'Test'),
            )->label('About')
        );
        MenuBar::create()->height(300)->route('widget.menubar')->alwaysOnTop();
        Window::open()
            ->width(800)
            ->height(800)->resizable(false);
    }

    /**
     * Return an array of php.ini directives to be set.
     */
    public function phpIni(): array
    {
        return [
            'memory_limit' => '512M',
            'display_errors' => '1',
            'error_reporting' => 'E_ALL',
            'max_execution_time' => '0',
            'max_input_time' => '0',
        ];
    }
}


class MenuBarClicked
{
    public function __construct(public array $combo, public array $bounds, public array $position)
    {
        // $combo - details of any combo keys pressed when the click occurred
        // $bounds - the current absolute bounds of the menu bar icon at the time of the event
        // $position - the absolute cursor position at the time of the event
    }
}
