package it.smartcommunitylab.trentorienta.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class EventType {

	@Id
	private String id;
	
	private String source;   // sorgenti
	
	@TextIndexed private String title;
	
	@TextIndexed private String description;
	@TextIndexed private String shortAbstract;

	private String category;      // temi
	private String image;
	private String eventStart;
	private String eventTiming;
	private String themes;
	private List<String> tags;  // etichette
	private String eventDate;
	private Float coordX;
	private Float coordY;
	private String created;
	private String eventoDate;
	private String createdDate;
	private long toTime;
	private String address;
	private String web;
	
	public String getEventDate() {
		return eventDate;
	}
	public void setEventDate(String fromTime) {
		this.eventDate = fromTime;
	}
	public long getToTime() {
		return toTime;
	}
	public List<String> getTags() {
		return tags;
	}
	public void setTags(List<String> tags) {
		this.tags = tags;
	}
	public void setToTime(long toTime) {
		this.toTime = toTime;
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public String getEventStart() {
		return eventStart;
	}
	public void setEventStart(String eventPeriod) {
		this.eventStart = eventPeriod;
	}
	public String getEventTiming() {
		return eventTiming;
	}
	public void setEventTiming(String eventTiming) {
		this.eventTiming = eventTiming;
	}
	public String getThemes() {
		return themes;
	}
	public void setThemes(String themes) {
		if (themes != null) {
			this.themes = themes;
		} else {
			this.themes = "";
		}
	}

	public Float getCoordX() {
		return coordX;
	}
	public void setCoordX(Float coordX) {
		this.coordX = coordX;
	}
	public Float getCoordY() {
		return coordY;
	}
	public void setCoordY(Float coordY) {
		this.coordY = coordY;
	}
	public String getCreated() {
		return created;
	}
	public void setCreated(String created) {
		this.created = created;
	}
	public String getEventoDate() {
		return eventoDate;
	}
	public void setEventoDate(String eventoDate) {
		this.eventoDate = eventoDate;
	}
	public String getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(String createdDate) {
		if (createdDate != null) 
			this.createdDate = createdDate;
		else
			this.createdDate = "";
		
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		if (address != null)
			this.address = address;
		else
			this.address = "";
	}
	public String getWeb() {
		return web;
	}
	public void setWeb(String web) {
		this.web = web;
	}
	public String getShortAbstract() {
		return shortAbstract;
	}
	public void setShortAbstract(String shortAbstract) {
		this.shortAbstract = shortAbstract;
	}

}
