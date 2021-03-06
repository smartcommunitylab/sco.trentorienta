package it.smartcommunitylab.trentorienta.repository;

import java.util.Date;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import it.smartcommunitylab.trentorienta.model.EventType;

public interface EventTypeRepositoryCustom {

	Page<EventType> findAllEventType(String[] themes, String[] sources, String[] tags, Date fromDate, Boolean sortForList, String filter, String lat, String lon,
			String radius, Pageable pageRequest);
	
	EventType findEvent(String id);
	
	Map<String, Integer> getThemes();
	
	Map<String, Integer> getTags();
	
	Map<String, Integer> getSources();
}
