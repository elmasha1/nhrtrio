<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

class AdminChatController extends Controller
{
    public function index(Request $request)
    {
        $q = Conversation::with('user:id,name,email,avatar')
            ->withCount(['messages as unread_count' => function ($x) {
                $x->whereNull('read_at')->where('sender_type', 'customer');
            }]);
        if ($s = $request->string('status')->toString()) $q->where('status', $s);
        return $q->orderByDesc('last_message_at')->paginate(20);
    }

    public function show(Conversation $conversation)
    {
        $conversation->messages()
            ->whereNull('read_at')
            ->where('sender_type', 'customer')
            ->update(['read_at' => now()]);
        return $conversation->load(['messages.sender:id,name,avatar,role', 'user:id,name,email']);
    }

    public function reply(Request $request, Conversation $conversation)
    {
        $data = $request->validate(['body' => 'required|string|max:2000']);
        $msg = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id'       => $request->user()->id,
            'sender_type'     => 'admin',
            'body'            => $data['body'],
        ]);
        $conversation->update([
            'last_message_at'     => now(),
            'assigned_admin_id'   => $conversation->assigned_admin_id ?? $request->user()->id,
            'status'              => 'open',
        ]);
        return response()->json($msg->load('sender:id,name,avatar,role'), 201);
    }

    public function close(Conversation $conversation)
    {
        $conversation->update(['status' => 'closed']);
        return response()->json(['message' => 'Closed']);
    }
}
