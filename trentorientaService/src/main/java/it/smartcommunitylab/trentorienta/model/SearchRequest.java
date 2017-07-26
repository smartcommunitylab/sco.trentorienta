package it.smartcommunitylab.trentorienta.model;

public class SearchRequest {
	private Integer start; 
	private Integer size;
	private String[] source;
	private String[] tag;
	private String[] themes;
	private String fromDate;
	private Integer sortForList;
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
}
