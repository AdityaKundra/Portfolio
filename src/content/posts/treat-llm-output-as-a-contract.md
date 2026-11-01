---
title: Treat LLM output as a contract
kind: note
date: 2026-11-02
summary: Why Resume Studio asks the model for JSON and validates every attempt.
tags: [ai]
---

In Resume Studio the model writes JSON against a schema, and any validation issues go back to it with a repair prompt. The PDF pipeline never has to interpret prose. That is more code up front, and far fewer surprises downstream.
