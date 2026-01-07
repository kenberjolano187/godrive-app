<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\UserRepository;
use App\Services\UserService;
use App\Services\FileUploadService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register FileUploadService as singleton
        $this->app->singleton(FileUploadService::class, function ($app) {
            return new FileUploadService();
        });

        // Register UserRepository
        $this->app->bind(UserRepository::class, function ($app) {
            return new UserRepository();
        });

        // Register UserService
        $this->app->bind(UserService::class, function ($app) {
            return new UserService(
                $app->make(UserRepository::class),
                $app->make(FileUploadService::class)
            );
        });

        // Register VerificationRepository
        $this->app->bind(\App\Repositories\VerificationRepository::class, function ($app) {
            return new \App\Repositories\VerificationRepository();
        });

        // Register VerificationService
        $this->app->bind(\App\Services\VerificationService::class, function ($app) {
            return new \App\Services\VerificationService(
                $app->make(\App\Repositories\VerificationRepository::class),
                $app->make(FileUploadService::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}