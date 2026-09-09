package com.scholaros.homework.ai;

public interface AIProvider {

    String generateContent(String prompt);

    String getModelName();
}
