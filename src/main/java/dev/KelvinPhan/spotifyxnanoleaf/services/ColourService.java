package dev.KelvinPhan.spotifyxnanoleaf.services;

import de.androidpit.colorthief.ColorThief;
import de.androidpit.colorthief.MMCQ;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.net.URL;
import java.awt.Color;

@Service
/**
 * colourService class that helps process colours using ColorThief package
 */
public class ColourService {

    /**
     * Creates an RGB string out of a RGB value array
     * @param rgb   the RGB value array
     * @return      returns the RGB value array as a string RGB representation
     */
    private static String createRGBString(int[] rgb) {
        return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    }

    /**
     * Grabs the 6 dominant colours of an image using ColourThief
     * @param url   the URL of the image
     * @return      a String of all 6 dominant RGB values as an RGBString
     * @throws IOException
     */
    public static String get6Colours(String url) throws IOException{

        try{
            BufferedImage img = ImageIO.read(new URL(url));
            MMCQ.CMap result = ColorThief.getColorMap(img, 6);

            int[] rgb = null;
            String rgbString = "";
            for (MMCQ.VBox vbox : result.vboxes) {
                rgb = vbox.avg(false);
                rgbString += createRGBString(rgb) + ":";
            }
            rgbString = rgbString.replaceAll(":$", "");

            return rgbString;

        }catch (IOException e){
            return e.getMessage();
        }
    }

    /**
     * Converts an RGBString into it's respective HSV representation
     * @param rgbString     the RGBString to be converted
     * @return              an Integer array containing the RGB value converted into HSV
     */
    public static int[] convertToHSB(String rgbString) {
        int r = Integer.parseInt(rgbString.split("rgb\\(")[1].split(",")[0]);
        int g = Integer.parseInt(rgbString.split("rgb\\(")[1].split(",")[1]);
        int b = Integer.parseInt(rgbString.split("rgb\\(")[1].split(",")[2].split("\\)")[0]);

        float[] hsv = Color.RGBtoHSB(r,g,b, null);

        int[] newHSV = new int[3];

        newHSV[0] = (int) (hsv[0] * 360);
        newHSV[1] = (int) (hsv[1] * 100);
        newHSV[2] = (int) (hsv[2] * 100);

        return newHSV;
    }
}
