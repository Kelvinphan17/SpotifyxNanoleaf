package dev.KelvinPhan.spotifyxnanoleaf.services;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
/**
 * Service class that consumes an API call to modify the Nanoleaf Effect
 */
public class NanoleafModifyEffectService {


    // RestTemplate initialization to perform REST API calls
    RestTemplate restTemplate = new RestTemplate();

    // Initialize colourService
    final ColourService colourService = new ColourService();

    // Pulls Nanoleaf IP from application.properties
    @Value("${ip}")
    private String ip;

    // Pulls Nanoleaf Token from application.properties
    @Value("${token}")
    private String token;

    /**
     * Helper method that creates palette JSON Object
     * @param sixColours    the sixColours String array
     * @return              a JSONArray containing the HSB representation of the six dominant colours
     */
    public JSONArray createPalette(String[] sixColours){

        JSONArray palette = new JSONArray();

        JSONObject colour1 = new JSONObject();
        colour1.put("hue", colourService.convertToHSB(sixColours[0])[0]);
        colour1.put("saturation", colourService.convertToHSB(sixColours[0])[1]);
        colour1.put("brightness", colourService.convertToHSB(sixColours[0])[2]);

        JSONObject colour2 = new JSONObject();
        colour2.put("hue", colourService.convertToHSB(sixColours[1])[0]);
        colour2.put("saturation", colourService.convertToHSB(sixColours[1])[1]);
        colour2.put("brightness", colourService.convertToHSB(sixColours[1])[2]);

        JSONObject colour3 = new JSONObject();
        colour3.put("hue", colourService.convertToHSB(sixColours[2])[0]);
        colour3.put("saturation", colourService.convertToHSB(sixColours[2])[1]);
        colour3.put("brightness", colourService.convertToHSB(sixColours[2])[2]);

        JSONObject colour4 = new JSONObject();
        colour4.put("hue", colourService.convertToHSB(sixColours[3])[0]);
        colour4.put("saturation", colourService.convertToHSB(sixColours[3])[1]);
        colour4.put("brightness", colourService.convertToHSB(sixColours[3])[2]);

        JSONObject colour5 = new JSONObject();
        colour5.put("hue", colourService.convertToHSB(sixColours[4])[0]);
        colour5.put("saturation", colourService.convertToHSB(sixColours[4])[1]);
        colour5.put("brightness", colourService.convertToHSB(sixColours[4])[2]);

        JSONObject colour6 = new JSONObject();
        colour6.put("hue", colourService.convertToHSB(sixColours[5])[0]);
        colour6.put("saturation", colourService.convertToHSB(sixColours[5])[1]);
        colour6.put("brightness", colourService.convertToHSB(sixColours[5])[2]);

        palette.put(colour1);
        palette.put(colour2);
        palette.put(colour3);
        palette.put(colour4);
        palette.put(colour5);
        palette.put(colour6);

        return palette;
    }

    /**
     * Helper method that creates the option JSON Object
     * @param speed     the int value to set that animation speed to
     * @return          a JSONArray containing the Nanoleaf effect options
     */
    public JSONArray createOptions(int speed){

        JSONArray options = new JSONArray();

        JSONObject direction = new JSONObject();
        direction.put("name", "linDirection");
        direction.put("value", "right");

        JSONObject loop = new JSONObject();
        loop.put("name", "loop");
        loop.put("value", true);

        JSONObject colorsPF = new JSONObject();
        colorsPF.put("name", "nColorsPerFrame");
        colorsPF.put("value", 2);

        JSONObject transTime = new JSONObject();
        transTime.put("name", "transTime");
        transTime.put("value", speed);

        options.put(direction);
        options.put(loop);
        options.put(colorsPF);
        options.put(transTime);

        return options;

    }

    /**
     * Makes a PUT API call to Nanoleaf OpenAPI to change effect palette and options
     * @param effect    a nanoleafEffect class that contains palette and speed information
     * @return          returns response from API call
     */
    public ResponseEntity<Object> modifyEffect(NanoleafEffect effect){

        // Create URI string where API call will be made
        String uri = "http://"+ip+":16021/api/v1/"+token+"/effects";

        // Creates header that states that body will be JSON
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create JSON objects to pass to body
        JSONObject json = new JSONObject();

        JSONObject body = new JSONObject();
        body.put("command", "add");
        body.put("version", "2.0");
        body.put("animName", "Spotify Animation");
        body.put("animType", "plugin");
        body.put("colorType", "HSB");
        body.put("palette", createPalette(effect.getSixColours()));
        body.put("pluginType", "color");
        body.put("pluginUuid", "6970681a-20b5-4c5e-8813-bdaebc4ee4fa");
        body.put("pluginOptions", createOptions(effect.getSpeed()));
        body.put("hasOverlay", false);

        json.put("write", body);

        // Creates a new HttpEntity to consume the API call
        HttpEntity<?> entity = new HttpEntity<Object>(json.toString(), headers);

        // Consume the API call and get the Response
        ResponseEntity<Object> response = restTemplate.exchange(uri, HttpMethod.PUT, entity, Object.class);

        return response;



    }
}
