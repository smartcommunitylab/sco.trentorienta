package com.example.demo.repository;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.demo.model.EventType;

public interface EventTypeRepositoryCustom {

	Page<EventType> findAllEventType(String[] themes, String[] sources, String[] tags, String fromDate, Pageable pageRequest);
	
	EventType findEvent(String id);
	
	Map<String, Integer> getThemes();
	
	Map<String, Integer> getTags();
	
	Map<String, Integer> getSources();
}
