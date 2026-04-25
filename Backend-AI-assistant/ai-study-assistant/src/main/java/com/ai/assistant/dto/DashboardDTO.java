package com.ai.assistant.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardDTO {
    private long totalChats;
    private long totalNotes;
    private long ollamaCount;
    private long todayChats;
    private long weekChats;
}
