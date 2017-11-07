package it.smartcommunitylab.trentorienta.repository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.data.mongodb.core.query.TextQuery;

import it.smartcommunitylab.trentorienta.model.EventType;

public class EventTypeRepositoryImpl implements EventTypeRepositoryCustom {

	private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmm");

	@Autowired
	private Environment env;

	/** Logging Authorization. **/
	public static final String LOGGING_AUTH = "Bearer 8dec15f1-3192-4ba0-a4f3-5762fb05243b";

	@Autowired
	private MongoTemplate template;

	/** HTTP Client. **/
	private HttpClient httpClient = new HttpClient(new MultiThreadedHttpConnectionManager());

	@Override
	public Page<EventType> findAllEventType(String[] themes, String[] sources, String[] tags, Date fromDate,
			Boolean sortForList, String filter, Pageable pageRequest) {

		// log 'SearchEvent'
		log("SearchEvent", "SearchEvent", UUID.randomUUID().toString());

		List<Criteria> criteria = new ArrayList<Criteria>();
		Criteria SearchCriteria = new Criteria();

		if (themes != null) {
			for (int i = 0; i < themes.length; i++) {
				criteria.add(Criteria.where("themes").is(themes[i]));
			}
		}
		if (sources != null) {
			for (int i = 0; i < sources.length; i++) {
				criteria.add(Criteria.where("source").is(sources[i]));
			}
		}
		if (tags != null) {
			for (int i = 0; i < tags.length; i++) {
				if (tags[i].compareTo("null") != 0)
					criteria.add(Criteria.where("tags").in(tags[i]));
			}
		}
		/*
		 * if (fromDate != null) { criteria.add(Criteria.where("toTime").gte (
		 * Long.parseLong(fromDate) )); }
		 */

		Query query = new Query();

		if (filter != null && filter != "") {
			TextCriteria criteriaTesto = TextCriteria.forDefaultLanguage().matchingAny(filter);
			query = TextQuery.queryText(criteriaTesto).sortByScore();
		}

		if (fromDate != null)
			SearchCriteria.andOperator(Criteria.where("toTime").gte(fromDate.getTime()));

		if (criteria.size() > 0)
			SearchCriteria.orOperator(criteria.toArray(new Criteria[criteria.size()]));

		if (fromDate != null || criteria.size() > 0)
			query.addCriteria(SearchCriteria);

		System.out.println(query.toString());

		if (sortForList) { // == 1
			query.with(new Sort(Sort.Direction.DESC, "created"));
		} else { // ** 0
			query.with(new Sort(Sort.Direction.ASC, "eventStart"));
		}

		Long total = template.count(query, EventType.class);

		query.skip(pageRequest.getOffset());
		query.limit(pageRequest.getPageSize());

		List<EventType> list = template.find(query, EventType.class);
		// Date now =
		// Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant());
		// in case the startDate is in the past, set it to requested date
		// contrary to previous logic of setting to current date.
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

		// log 'NotificationReadEvent'
		log("NotificationReadEvent", "NotificationReadEvent", UUID.randomUUID().toString());

		Query query = new Query();

		// query.addCriteria(Criteria.where("id").is(id));

		// System.out.println(query.toString());

		EventType ret = template.findById(id, EventType.class);

		return ret;
	}

	public void log(String msg, String type, String userId) {

		String logUrl = env.getProperty("log.endpoint");

		String body = "{" + "\"msg\" : \"" + msg + "\"," + "\"type\" : \"" + type + "\","
				+ "\"appId\": \"TrentoInformer\"," + "\"custom_attr\": " + "{\"appname\": \"TrentoInformer\","
				+ "\"userid\": \"" + userId + "\"" + "}" + "}";

		try {
			sendPOST(logUrl, "application/json", "application/json", LOGGING_AUTH, body, true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	// HTTP POST request
	public String sendPOST(String url, String accept, String contentType, String token, String json, boolean secure)
			throws Exception {

		String result = null;
		StringRequestEntity requestEntity = new StringRequestEntity(json, contentType, "UTF-8");
		PostMethod postMethod = new PostMethod(url);
		postMethod.setRequestEntity(requestEntity);

		if (token != null && !(token.isEmpty())) {
			postMethod.setRequestHeader("Authorization", token);
		}

		try {
			int statusCode = httpClient.executeMethod(postMethod);
			StringBuffer response = new StringBuffer();
			if ((statusCode >= 200) && (statusCode < 300)) {
				BufferedReader in = new BufferedReader(new InputStreamReader(postMethod.getResponseBodyAsStream()));
				String inputLine;
				while ((inputLine = in.readLine()) != null) {
					response.append(inputLine);
				}
				in.close();
				result = response.toString();
			}
		} finally {
			postMethod.releaseConnection();
		}
		return result;

	}

}
