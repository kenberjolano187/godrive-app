<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    const TYPE_ADMIN = 'admin';
    const TYPE_OWNER = 'owner';
    const TYPE_CUSTOMER = 'customer';

    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_BLOCKED = 'block';

    protected $fillable = [
        'firstname', 'lastname', 'birthdate', 'age', 'gender',
        'id_type', 'id_photo', 'phone_number', 'address',
        'photo', 'user_type', 'status', 'email',
        'appearance',
        'email_verified_at', 'password', 'otp', 'otp_expires_at'
    ];

    protected $hidden = [
        'password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token', 'otp',
    ];

    protected $appends = ['name'];

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn () => trim("{$this->firstname} {$this->lastname}") ?: $this->email
        );
    }

    protected function casts(): array
    {
        return [
            'birthdate' => 'date',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'otp_expires_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool { return $this->user_type === self::TYPE_ADMIN; }
    public function isOwner(): bool { return $this->user_type === self::TYPE_OWNER; }
    public function isCustomer(): bool { return $this->user_type === self::TYPE_CUSTOMER; }
}