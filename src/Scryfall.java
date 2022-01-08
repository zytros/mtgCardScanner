import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class Scryfall {
    /**
     * @param name name of card
     * @param expansion code of expansion
     * @return JSON
     * TODO: return price
     */
    public String getJSONData(String name, String expansion){
        name = name.replace(" ", "%20");
        HttpURLConnection connection = null;
        String out = "";
        try {
            URL url = null;
            if (expansion.equals("")){
                url = new URL("https://api.scryfall.com/cards/search?q=" + name);
            }else {
                url = new URL("https://api.scryfall.com/cards/search?q=" + name + " e:" + expansion);
            }
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            int responseCode = connection.getResponseCode();
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null){
                response.append(inputLine);
            }
            in.close();

            out = response.toString();



        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("fetched JSON data");
        return out;
    }

    public double getPrice(String json){
        int priceIdx = json.indexOf("prices");
        int endIdx = json.indexOf("tix");
        String prices = json.substring(priceIdx, endIdx);
        int eurIdx = prices.indexOf("eur")+6;
        String eurPrice = prices.substring(eurIdx, eurIdx + 10);
        String[] split = eurPrice.split("\"");
        return Double.parseDouble(split[0]);
    }
}
