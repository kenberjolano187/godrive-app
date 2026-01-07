<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;

class UserPreferenceController extends Controller
{
    public function updateAppearance(Request $request)
    {
        $validated = $request->validate([
            'appearance' => 'required|in:light,dark,system'
        ]);

        $request->user()->update([
            'appearance' => $validated['appearance']
        ]);

        Cookie::queue('appearance', $validated['appearance'], 60 * 24 * 365, null, null, false, false);

        return back();
    }
}