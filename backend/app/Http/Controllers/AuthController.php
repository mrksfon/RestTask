<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        //check Email

        $user = User::where('email', $fields['email'])->first();

        // Check password

        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                'errors' => [
                    'bad' => ['Bad credentials!']
                ]
            ], 401);
        }

        $token = $user->createToken('myapptoken')->plainTextToken;

        $response = [
            'user' => $user,
            'token' => $token
        ];

        return response($response, 201);
    }

    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();

        $message = ['message' => 'Logged out!'];

        return response($message);
    }
}
