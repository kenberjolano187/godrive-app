<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [                              
                'firstname' => 'Admin',
                'lastname' => 'User',
                'user_type' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
            ]
        );
    }
}