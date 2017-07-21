package com.example.demo.repository;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.demo.model.EventType;

public interface EventTypeRepositoryCustom {

	Page<EventType> findAllEventType(String[] themes, String[] sources, String[] tags, Pageable pageRequest);
	
	Map<String, Integer> getThemes();
}
