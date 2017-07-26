package it.smartcommunitylab.trentorienta.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.naming.directory.SearchResult;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import it.smartcommunitylab.trentorienta.model.Echo;
import it.smartcommunitylab.trentorienta.model.EventType;
import it.smartcommunitylab.trentorienta.model.SearchRequest;
import it.smartcommunitylab.trentorienta.repository.EchoRepository;
import it.smartcommunitylab.trentorienta.repository.EventTypeRepositoryCustom;

@RestController	
public class TestController {

	@Autowired
	private EchoRepository repo;
	@Autowired
	private EventTypeRepositoryCustom repo1;
	
	@GetMapping("/api/echo")
	public @ResponseBody List<Echo> echo() {
		Echo echo = new Echo();
		echo.setMessage("Ciao");
				
		repo.save(echo);
		
		return repo.findByMessage("Ciao");
	}
	
	@CrossOrigin(origins = "*")
	@GetMapping("/api/events")
	public @ResponseBody Page<EventType> getAllEvents(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size,
			@RequestParam(required=false) String[] source,
			@RequestParam(required=false) String[] tag,
			@RequestParam(required=false) String[] themes,
			@RequestParam(required=false) String fromDate,
			@RequestParam(required=false) Integer sortForList
			) {
		if (start == null) start = 0;
		if (size == null) size = 15;
		if (fromDate == null)
			fromDate = new SimpleDateFormat("YYYMMddHHmm").format(new Date().getTime());
		if (sortForList == null)
			sortForList = 1;
		if (sortForList == 1)
			return repo1.findAllEventType(themes, source, tag, fromDate, true, new PageRequest(start / size, size));
		else
			return repo1.findAllEventType(themes, source, tag, fromDate, false, new PageRequest(start / size, size));
	}

	@CrossOrigin(origins = "*")
	@PostMapping("/api/events")
	public @ResponseBody Page<EventType> getAllEvents(
			@RequestBody SearchRequest params
			) {
		int start = params.getStart() == null ? 0 : params.getStart();  
		int size = params.getSize() == null ? 15 : params.getSize();
		
		String fromDate = params.getFromDate() == null ? new SimpleDateFormat("YYYMMddHHmm").format(new Date().getTime()) : params.getFromDate();
		
		int sortForList = params.getSortForList() == null ? 1 : params.getSortForList();
		
		if (sortForList == 1)
			return repo1.findAllEventType(params.getThemes(), params.getSource(), params.getTag(), fromDate, true, new PageRequest(start / size, size));
		else
			return repo1.findAllEventType(params.getThemes(), params.getSource(), params.getTag(), fromDate, false, new PageRequest(start / size, size));
	}

	
	@CrossOrigin(origins = "*")
	@RequestMapping("/api/event")
	public @ResponseBody EventType getEvent(
			@RequestParam(value="id") String id
			) {
		
		return repo1.findEvent(id);
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping("/api/themes")
	public @ResponseBody Map<String, Integer> getThemeList(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size
			) {
		if (start == null) start = 0;
		if (size == null) size = 5;
		return repo1.getThemes();
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping("/api/tags")
	public @ResponseBody Map<String, Integer> getTagList(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size
			) {
		if (start == null) start = 0;
		if (size == null) size = 5;
		return repo1.getTags();
	}
	
	@CrossOrigin(origins = "*")
	@RequestMapping("/api/sources")
	public @ResponseBody Map<String, Integer> getSourceList(
			@RequestParam(required=false) Integer start, 
			@RequestParam(required=false) Integer size
			) {
		if (start == null) start = 0;
		if (size == null) size = 5;
		return repo1.getSources();
	}
	
	
}
