package com.ishikapandita.bookshelf.service.book;

import com.ishikapandita.bookshelf.model.OutboxEvent;
import com.ishikapandita.bookshelf.repository.OutboxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OutboxPublisher {

    @Autowired
    private OutboxRepository outboxRepository;

    @Autowired
    private PublisherService publisherService;

    @Scheduled(fixedRate = 5000) // every 5 sec
    public void publishEvents() {
        List<OutboxEvent> events = outboxRepository.findByProcessedFalse();

        for (OutboxEvent event : events) {
            try {
                publisherService.sendBookNotification(event.getPayload());
                event.setProcessed(true);
                outboxRepository.save(event);
            } catch (Exception e) {
                // DO NOTHING → retry later
            }
        }
    }
}
