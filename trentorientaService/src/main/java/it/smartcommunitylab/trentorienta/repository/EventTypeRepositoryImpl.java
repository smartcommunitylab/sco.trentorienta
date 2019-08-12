package it.smartcommunitylab.trentorienta.repository;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.geo.Circle;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.geo.Sphere;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import it.smartcommunitylab.trentorienta.model.EventType;

public class EventTypeRepositoryImpl implements EventTypeRepositoryCustom {

	private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmm");

	@Autowired
	private Environment env;

	@Autowired
	private MongoTemplate template;

	/** HTTP Client. **/
	private HttpClient httpClient = new HttpClient(new MultiThreadedHttpConnectionManager());

	@Override
	public Page<EventType> findAllEventType(String[] themes, String[] sources, String[] tags, Date fromDate,
			Boolean sortForList, String filter, String lat, String lon, String radius, Pageable pageRequest) {

		 List<Criteria> criteria = new LinkedList<Criteria>();

		if (themes != null && themes.length > 0) {
			criteria.add(Criteria.where("themes").in((Object[])themes));
		}

		if (sources != null && sources.length > 0) {
			criteria.add(Criteria.where("source").in((Object[])sources));
		}

		if (tags != null && tags.length > 0) {
			criteria.add(Criteria.where("tags").in((Object[])Arrays.asList(tags).stream().filter(t -> !t.equals("null")).toArray()));
		}

		if (filter != null && filter != "") {
			Criteria filterSearch = new Criteria().orOperator(Criteria.where("source").regex(filter),
					Criteria.where("title").regex(filter), Criteria.where("description").regex(filter),
					Criteria.where("shortAbstract").regex(filter), Criteria.where("category").regex(filter));
			criteria.add(filterSearch);

		}

		if (fromDate != null) {
			criteria.add(Criteria.where("toTime").gte(fromDate.getTime()));
		}

		if (lat != null && lon != null && isDouble(lat) && isDouble(lon) && radius != null && isDouble(radius)) {
			Point pFrom = new Point(Double.parseDouble(lat), Double.parseDouble(lon));
			Circle circleFrom = new Circle(pFrom, Double.parseDouble(radius) / 6371);
			Sphere sphereFrom = new Sphere(circleFrom);
			Criteria zoneCriteria = Criteria.where("coordinates").within(sphereFrom);
			criteria.add(zoneCriteria);
		}
		Query query = Query.query(new Criteria().andOperator((Criteria[])criteria.toArray(new Criteria[criteria.size()]))); 
		
//		System.out.println(query.toString());

		if (sortForList == null || sortForList) { // == 1
			query.with(new Sort(Sort.Direction.DESC, "created"));
		} else { // ** 0
			query.with(new Sort(Sort.Direction.ASC, "created"));
		}

		Long total = template.count(query, EventType.class);

		query.skip(pageRequest.getOffset());
		query.limit(pageRequest.getPageSize());

		List<EventType> list = template.find(query, EventType.class);
		list.forEach(evt -> {
			if (evt.getEventStart() != null) {
				try {
					Date d = DATE_FORMAT.parse(evt.getEventStart());
					if (d.before(fromDate)) {
						evt.setEventStart(DATE_FORMAT.format(fromDate));
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});

		return new PageImpl<>(list, pageRequest, total);
	}

	public Map<String, Integer> getThemes() {
		AggregationOperation group = Aggregation.group("themes").count().as("count");

		Aggregation a = Aggregation.newAggregation(Aggregation.project("themes"),
				// Aggregation.unwind("themes"),
				group);

		AggregationResults<HashMap> aggregate = template.aggregate(a, EventType.class, HashMap.class);
		Map<String, Integer> map = new HashMap<>();
		aggregate.forEach(entry -> {
			map.put((String) entry.get("_id"), (Integer) entry.get("count"));
		});

		return map;
	}

	@Override
	public Map<String, Integer> getTags() {
		AggregationOperation group = Aggregation.group("tags").count().as("count");

		Aggregation a = Aggregation.newAggregation(Aggregation.project("tags"), Aggregation.unwind("tags"), group);

		AggregationResults<HashMap> aggregate = template.aggregate(a, EventType.class, HashMap.class);
		Map<String, Integer> map = new HashMap<>();
		aggregate.forEach(entry -> {
			map.put((String) entry.get("_id"), (Integer) entry.get("count"));
		});

		return map;
	}

	@Override
	public Map<String, Integer> getSources() {
		AggregationOperation group = Aggregation.group("source").count().as("count");

		Aggregation a = Aggregation.newAggregation(Aggregation.project("source"),
				// Aggregation.unwind("source"),
				group);

		AggregationResults<HashMap> aggregate = template.aggregate(a, EventType.class, HashMap.class);
		Map<String, Integer> map = new HashMap<>();
		aggregate.forEach(entry -> {
			map.put((String) entry.get("_id"), (Integer) entry.get("count"));
		});

		return map;
	}

	@Override
	public EventType findEvent(String id) {
		EventType ret = template.findById(id, EventType.class);
		return ret;
	}

	boolean isDouble(String str) {
		try {
			Double.parseDouble(str);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

}
