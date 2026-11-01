---
title: Why I built the same voice assistant twice
kind: blog
date: 2026-11-02
summary: Two architectures for one assistant, and what each one asks you to run and operate.
tags: [voice, ai, architecture]
---

A voice assistant sounds like one feature. In practice it is a pipeline: capture speech, work out when the person has finished, transcribe it, generate a reply, turn that into audio, and play it back while the conversation is still moving.

I wanted to understand how the structure of that pipeline changes what you have to run, so I built it on two architectures.

## The first attempt was not a conversation

My first proof of concept recorded about three seconds of audio and uploaded it to a `POST` endpoint. It worked, in the sense that audio went in and audio came out. But a fixed recording window cannot behave like a conversation, so I moved it to a legacy folder and made LiveKit the supported transport.

## Stack one: everything local and inspectable

The browser publishes mic audio to a LiveKit room and sends small rolling chunks to an Express server. A Flask service transcribes them with faster-whisper, Ollama writes a short reply, Sarvam generates an MP3, and a LiveKit data packet tells the browser to play it.

Every stage has an output you can look at, which makes it easy to debug. The cost is a Python sidecar and several processes to keep running.

## Stack two: a worker in the room

Here Express only serves health checks, tokens and the client page. A LiveKit Agents worker does the rest: Silero VAD finds the end of each utterance, AssemblyAI transcribes it, the LLM replies, and audio is published straight back into the room.

There are fewer local processes, and it is closer to how a live call behaves. The cost is depending on hosted speech APIs.

## What I would measure next

The worker already logs STT wall time and LLM time to first token. I have not published an end-to-end latency comparison between the two stacks yet, and that is the obvious next step.

The code is in the [Voice Assistant Lab repository](https://github.com/AdityaKundra/Voice-prototypes-two-stacks-).
