<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountVerificationNotification extends Notification
{
    use Queueable;

    protected $otp;

    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $appName = config('app.name', 'Our Application');
        $userName = $notifiable->firstname ?? 'there';
        
        return (new MailMessage)
            ->subject('Your Verification Code for ' . $appName)
            ->greeting('Hello ' . $userName . '!')
            ->line('Thank you for registering with ' . $appName . '.')
            ->line('To complete your account verification, please use this code:')
            ->line('# ' . $this->otp)
            ->line('This verification code will expire in 10 minutes.')
            ->line('For your security, please do not share this code with anyone.')
            ->line('If you did not create an account with us, please disregard this email.')
            ->salutation('Best regards, The ' . $appName . ' Team');
    }
}