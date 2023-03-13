package dev.KelvinPhan.spotifyxnanoleaf.services;


import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
/**
 * Service class that consumes an API call to modify the Nanoleaf on state
 */
public class NanoleafToggleService {


    // RestTemplate initialization to perform REST API calls
    RestTemplate restTemplate = new RestTemplate();

    // Pulls Nanoleaf IP from application.properties
    @Value("${ip}")
    private String ip;

    // Pulls Nanoleaf Token from application.properties
    @Value("${token}")
    private String token;

    /**
     * Makes a PUT API call to Nanoleaf OpenAPI to change on state
     * @param state     boolean value for whether the Nanoleaf should be on or not
     * @return          returns response from API call
     */
    public ResponseEntity<Object> toggle(boolean state){

        // Create URI string where API call will be made
        String uri = "http://"+ip+":16021/api/v1/"+token+"/state";

        // Creates header that states that body will be JSON
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create JSON objects to pass to body
        JSONObject json = new JSONObject();
        JSONObject stateJson = new JSONObject();
        stateJson.put("value", state);
        json.put("on", stateJson);

        // Creates a new HttpEntity to consume the API call
        HttpEntity<?> entity = new HttpEntity<Object>(json.toString(), headers);

        // Consume the API call and get the Response
        ResponseEntity<Object> response = restTemplate.exchange(uri, HttpMethod.PUT, entity, Object.class);

        return response;


    }


}
