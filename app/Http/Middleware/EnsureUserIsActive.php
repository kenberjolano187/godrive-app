<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            
            if ($user->status !== 'active') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                
                $message = match($user->status) {
                    'inactive' => 'Your account is pending approval. Please wait for admin verification.',
                    'block' => 'Your account has been blocked. Please contact support.',
                    default => 'Your account is not active.',
                };
                
                return redirect()->route('login')
                    ->with('error', $message);
            }
        }
        
        return $next($request);
    }
}