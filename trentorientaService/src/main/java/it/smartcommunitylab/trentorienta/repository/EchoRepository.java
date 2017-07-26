package it.smartcommunitylab.trentorienta.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import it.smartcommunitylab.trentorienta.model.Echo;
import it.smartcommunitylab.trentorienta.model.EventType;

public interface EchoRepository extends MongoRepository<Echo, String> {

	List<Echo> findByMessage(String message);
	
	@Query("{message:?0}")
	List<Echo> search(String message);

	@Query("{title:?0}")
	List<EventType> findByEvent();

}
