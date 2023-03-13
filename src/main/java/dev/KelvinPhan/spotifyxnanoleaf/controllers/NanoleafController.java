package dev.KelvinPhan.spotifyxnanoleaf.controllers;

import dev.KelvinPhan.spotifyxnanoleaf.services.NanoleafBrightnessService;
import dev.KelvinPhan.spotifyxnanoleaf.services.NanoleafEffect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import dev.KelvinPhan.spotifyxnanoleaf.services.NanoleafToggleService;
import dev.KelvinPhan.spotifyxnanoleaf.services.NanoleafModifyEffectService;

@RestController
@RequestMapping("/api/nanoleaf")
@CrossOrigin(origins="*")
/**
 * RestController that handles Nanoleaf API calls from frontend
 */
public class NanoleafController {

    @Autowired
    private NanoleafModifyEffectService nanoleafEffectService;
    @Autowired
    private NanoleafToggleService toggleService;
    @Autowired
    private NanoleafBrightnessService brightnessService;

    @PostMapping("modifyEffect")
    /**
     * On API call to /api/nanoleaf/modifyEffect, get request body and send data to NanoleafModifyEffectService
     */
    public void modifyEffect(@RequestBody NanoleafEffect effect){

        nanoleafEffectService.modifyEffect(effect);

    }

    @PostMapping("toggle")
    /**
     * On API call to /api/nanoleaf/toggle, get request body and send data to nanoleafToggleService
     */
    public void toggleNanoleaf(@RequestBody boolean state){

        toggleService.toggle(state);

    }

    @PostMapping("brightness")
    /**
     * On API call to /api/nanoleaf/brightness, get request body and send data to nanoleafBrightnessService
     */
    public void toggleNanoleaf(@RequestBody int brightness){

        brightnessService.setBrightness(brightness);

    }




}
