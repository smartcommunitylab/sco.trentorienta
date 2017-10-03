package it.smartcommunitylab.trentorienta.controllers;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;
import it.smartcommunitylab.trentorienta.model.EventType;
import it.smartcommunitylab.trentorienta.model.SearchRequest;
import it.smartcommunitylab.trentorienta.repository.EventTypeRepositoryCustom;

@RestController
public class DataController {

	@Autowired
	private EventTypeRepositoryCustom repo1;

	private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmm");

	@ApiOperation(value = "getAllEvents")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET, value ="/api/events")
	public @ResponseBody Page<EventType> getAllEvents(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size,
			@RequestParam(required=false) String[] source,
			@RequestParam(required=false) String[] tag,
			@RequestParam(required=false) String[] themes,
			@RequestParam(required=false) String fromDateStr,
			@RequestParam(required=false) Integer sortForList,
			@RequestParam(required=false) String filter
			) throws ParseException {
		if (start == null) start = 0;
		if (size == null) size = 15;
		Date fromDate = StringUtils.isEmpty(fromDateStr) ? null : DATE_FORMAT.parse(fromDateStr);
		if (sortForList == null)
			sortForList = 1;
		if (sortForList == 1)
			return repo1.findAllEventType(themes, source, tag, fromDate, true, filter, new PageRequest(start / size, size));
		else
			return repo1.findAllEventType(themes, source, tag, fromDate, false, filter, new PageRequest(start / size, size));
	}

	@ApiOperation(value = "getAllEventsWithSearchRequest")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.POST, value ="/api/events")
	@PostMapping("/api/events")
	public @ResponseBody Page<EventType> getAllEventsWithSearchRequest(
			@RequestBody SearchRequest params
			) throws ParseException {
		int start = params.getStart() == null ? 0 : params.getStart();  
		int size = params.getSize() == null ? 15 : params.getSize();
		
		Date fromDate = StringUtils.isEmpty(params.getFromDate()) ? null : DATE_FORMAT.parse(params.getFromDate());
		
		int sortForList = params.getSortForList() == null ? 1 : params.getSortForList();
		
		if (sortForList == 1)
			return repo1.findAllEventType(params.getThemes(), params.getSource(), params.getTag(), fromDate, true, params.getFilter(), new PageRequest(start / size, size));
		else
			return repo1.findAllEventType(params.getThemes(), params.getSource(), params.getTag(), fromDate, false, params.getFilter(), new PageRequest(start / size, size));
	}

	@ApiOperation(value = "getEvent")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET, value="/api/event")
	public @ResponseBody EventType getEvent(
			@RequestParam(value="id") String id
			) {
		
		return repo1.findEvent(id);
	}
	
	@ApiOperation(value = "getThemeList")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET, value="/api/themes")
	public @ResponseBody Map<String, Integer> getThemeList(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size
			) {
		if (start == null) start = 0;
		if (size == null) size = 5;
		return repo1.getThemes();
	}
	
	@ApiOperation(value = "getTagList")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET, value="/api/tags")
	public @ResponseBody Map<String, Integer> getTagList(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size
			) {
		if (start == null) start = 0;
		if (size == null) size = 5;
		return repo1.getTags();
	}
	
	@ApiOperation(value = "getSourceList")
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.GET, value="/api/sources")
	public @ResponseBody Map<String, Integer> getSourceList(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size
			) {
		if (start == null) start = 0;
		if (size == null) size = 5;
		return repo1.getSources();
	}
	
	
}
