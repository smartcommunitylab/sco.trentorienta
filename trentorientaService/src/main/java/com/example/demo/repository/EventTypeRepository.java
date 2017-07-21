package com.example.demo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.demo.model.EventType;

public interface EventTypeRepository extends MongoRepository<EventType, String> {

	@Query("{ 'title' : { $regex: ?0 } }")
	List<EventType> findByEventType(String term);

//	@Query("{$or:[{'themes':{$in:?0}},{'source':{$in:?1}},{'tags':{$in:?2}}]}")
//	Page<EventType> findAllEventType(String[] themes, String[] sources, String[] tags, Pageable pageRequest);
	
	@Query("{ 'eventType' : { $regex: ?0 } }")
	Page<EventType> findEventByTheme(String eventType, Pageable pageRequest);

}
