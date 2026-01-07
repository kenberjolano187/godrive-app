<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserType
{
    public function handle(Request $request, Closure $next, string ...$userTypes): Response
    {
        if (!$request->user()) {
            return redirect('/login');
        }

        if (!in_array($request->user()->user_type, $userTypes)) {
            return match($request->user()->user_type) {
                'admin' => redirect()->route('dashboard'),
                'owner' => redirect()->route('dashboard'),
                'customer' => redirect()->route('customer.dashboard'),
                default => redirect('/'),
            };
        }

        return $next($request);
    }
}