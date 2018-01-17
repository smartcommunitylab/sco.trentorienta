package it.smartcommunitylab.trentorienta.model;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement()
public class SearchRequest {
	private Integer start;
	private Integer size;
	private String[] source;
	private String[] tag;
	private String[] themes;
	private String fromDate;
	private Integer sortForList;
	private String filter;
	private String lat, lon, radius;

	public String getLat() {
		return lat;
	}

	public void setLat(String lat) {
		this.lat = lat;
	}

	public String getLon() {
		return lon;
	}

	public void setLon(String lon) {
		this.lon = lon;
	}

	public String getRadius() {
		return radius;
	}

	public void setRadius(String radius) {
		this.radius = radius;
	}

	public Integer getStart() {
		return start;
	}

	public void setStart(Integer start) {
		this.start = start;
	}

	public Integer getSize() {
		return size;
	}

	public void setSize(Integer size) {
		this.size = size;
	}

	public String[] getSource() {
		return source;
	}

	public void setSource(String[] source) {
		this.source = source;
	}

	public String[] getTag() {
		return tag;
	}

	public void setTag(String[] tag) {
		this.tag = tag;
	}

	public String[] getThemes() {
		return themes;
	}

	public void setThemes(String[] themes) {
		this.themes = themes;
	}

	public String getFromDate() {
		return fromDate;
	}

	public void setFromDate(String fromDate) {
		this.fromDate = fromDate;
	}

	public Integer getSortForList() {
		return sortForList;
	}

	public void setSortForList(Integer sortForList) {
		this.sortForList = sortForList;
	}

	public String getFilter() {
		return filter;
	}

	public void setFilter(String filter) {
		this.filter = filter;
	}
}
