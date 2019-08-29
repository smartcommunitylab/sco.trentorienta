package it.smartcommunitylab.trentorienta;

import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import it.smartcommunitylab.trentorienta.funerali.Defunto;
import it.smartcommunitylab.trentorienta.funerali.Funerale;
import it.smartcommunitylab.trentorienta.model.FuneraleDTO;
import it.smartcommunitylab.trentorienta.services.FuneraliService;

@RunWith(SpringRunner.class)
@SpringBootTest
@Ignore
public class TrentorientaFuneraleServiceTests {

	@Autowired
	private FuneraliService service; 
	
	@Test
	public void callFunerale() throws Exception {
		List<FuneraleDTO> list = service.getFunerale(Instant.now()).stream().map(f -> new FuneraleDTO(f)).collect(Collectors.toList());
		list.forEach(f -> System.err.println(f));
		assertNotNull(list);
		assertNotEquals(0, list.size());
	}
	@Test
	public void callFuneraleDay() throws Exception {
		List<Funerale> list = service.getFuneraleDay(Instant.now());
		assertNotNull(list);
		assertNotEquals(0, list.size());
	}
	@Test
	public void callDefunto() throws Exception {
		List<Funerale> list = service.getFuneraleDay(Instant.now());
		assertNotNull(list);
		assertNotEquals(0, list.size());
		
		List<Defunto> list2 = service.getDefunto(list.get(0).getNome());
		assertNotNull(list2);
		assertNotEquals(0, list2.size());
	}

}
