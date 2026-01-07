<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    public function handle(Request $request, Closure $next): Response
    {
        $appearance = $request->cookie('appearance') ?? 'system';

        if ($user = $request->user()) {
            $dbAppearance = $user->appearance;

            if ($dbAppearance && $dbAppearance !== $appearance) {
                $appearance = $dbAppearance;
                Cookie::queue('appearance', $appearance, 60 * 24 * 365, null, null, false, false);
            }
        }

        View::share('appearance', $appearance);

        return $next($request);
    }
}