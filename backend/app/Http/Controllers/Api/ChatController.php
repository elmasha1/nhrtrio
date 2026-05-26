<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function myConversation(Request $request)
    {
        $user = $request->user();
        $conv = Conversation::where('user_id', $user->id)->latest('last_message_at')->first()
            ?? Conversation::create([
                'user_id' => $user->id,
                'status'  => 'open',
                'subject' => 'Customer Support',
            ]);
        return $conv->load(['messages.sender:id,name,avatar,role']);
    }

    public function send(Request $request)
    {
        $data = $request->validate(['body' => 'required|string|max:2000']);
        $user = $request->user();

        $conv = Conversation::firstOrCreate(
            ['user_id' => $user->id, 'status' => 'open'],
            ['subject' => 'Customer Support']
        );

        $msg = Message::create([
            'conversation_id' => $conv->id,
            'sender_id'       => $user->id,
            'sender_type'     => $user->isAdmin() ? 'admin' : 'customer',
            'body'            => $data['body'],
        ]);

        $conv->update(['last_message_at' => now(), 'status' => 'open']);

        return response()->json($msg->load('sender:id,name,avatar,role'), 201);
    }

    public function poll(Request $request)
    {
        $user = $request->user();
        $since = $request->integer('since', 0);

        $conv = Conversation::where('user_id', $user->id)->latest('last_message_at')->first();
        if (! $conv) return response()->json(['messages' => [], 'conversation_id' => null]);

        $q = $conv->messages()->with('sender:id,name,avatar,role');
        if ($since) $q->where('id', '>', $since);
        $messages = $q->get();

        $conv->messages()
            ->whereNull('read_at')
            ->where('sender_type', '!=', 'customer')
            ->update(['read_at' => now()]);

        return response()->json(['conversation_id' => $conv->id, 'messages' => $messages]);
    }

    public function guestStart(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:120',
            'email' => 'required|email',
            'body'  => 'required|string|max:2000',
        ]);

        $conv = Conversation::create([
            'guest_name'  => $data['name'],
            'guest_email' => $data['email'],
            'status'      => 'open',
            'subject'     => 'Guest inquiry',
            'last_message_at' => now(),
        ]);

        Message::create([
            'conversation_id' => $conv->id,
            'sender_type'     => 'customer',
            'body'            => $data['body'],
        ]);

        return response()->json(['conversation_id' => $conv->id], 201);
    }
}
