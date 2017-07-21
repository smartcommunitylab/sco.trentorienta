package com.example.demo.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.example.demo.model.EventType;
import com.mongodb.DBCollection;

public class EventTypeRepositoryImpl implements EventTypeRepositoryCustom {

	@Autowired
	private MongoTemplate template;
	
	@Override
	public Page<EventType> findAllEventType(String[] themes, String[] sources, String[] tags, Pageable pageRequest) {
		List<Criteria> criteria = new ArrayList<Criteria>();
		Criteria SearchCriteria = new Criteria();

		if (themes != null) {
			for (int i = 0; i < themes.length; i ++ ) {
				criteria.add(Criteria.where("themes").is(themes[i]));
			}
		}
		if (sources != null) {
			for (int i = 0; i < sources.length; i ++ ) {
				criteria.add(Criteria.where("source").is(sources[i]));
			}
		}
		if (tags != null) {
			for (int i = 0; i < tags.length; i ++ ) {
				criteria.add(Criteria.where("tags").in(tags[i]));
			}
		}
		
		Query query = new Query();
		
		if (criteria.size() > 0)
			SearchCriteria.orOperator(criteria.toArray(new Criteria[criteria.size()]));
			query.addCriteria(SearchCriteria);
			
			System.out.println(query.toString());
		
		Long total = template.count(query, EventType.class);
			
		query.skip(pageRequest.getOffset());
		query.limit(pageRequest.getPageSize());
		
		List<EventType> list = template.find(query, EventType.class);
		
		return new PageImpl<>(list, pageRequest, total);
	}
	
	public Map<String, Integer> getThemes() {
		
		DBCollection thisColl = template.getCollection(template.getCollectionName(EventType.class));
		
		AggregationOperation group = Aggregation.group("themes").count().as("count");
		
		
		Aggregation a = Aggregation.newAggregation(
				Aggregation.project("themes"),
				Aggregation.unwind("themes"),
				group
				
		);
				
		AggregationResults<HashMap> aggregate = template.aggregate(a, EventType.class, HashMap.class);
		Map<String, Integer> map = new HashMap<>();
		aggregate.forEach(entry -> {
			map.put((String)entry.get("_id"), (Integer)entry.get("count"));
		});
		
		return map;
	}

}