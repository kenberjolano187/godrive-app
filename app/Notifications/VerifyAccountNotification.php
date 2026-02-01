<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyAccountNotification extends Notification
{
    use Queueable;

    protected $verificationUrl;

    public function __construct($verificationUrl)
    {
        $this->verificationUrl = $verificationUrl;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $appName = config('app.name', 'GoDrive');
        
        return (new MailMessage)
            ->subject('Complete Your ' . $appName . ' Registration')
            ->greeting('Hello!')
            ->line('Thank you for registering with ' . $appName . '.')
            ->line('To activate your account and complete your profile, please click the button below:')
            ->action('Verify Your Account', $this->verificationUrl)
            ->line('This verification link will expire in 24 hours.')
            ->line('If you did not create an account with us, no further action is required.')
            ->salutation('Best regards, The ' . $appName . ' Team');
    }
}