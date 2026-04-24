package com.example.MapleChat.exception;

import org.springframework.http.HttpStatus;

public class NexonApiException extends RuntimeException {

    private final HttpStatus status;

    public NexonApiException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
