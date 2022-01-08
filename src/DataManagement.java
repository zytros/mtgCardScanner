import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DataManagement {

    public Connection getConnection() throws Exception{
        try {
            String url = "jdbc:mysql://localhost:3306/cards";
            String username = "usr";
            String password = "12345";

            Connection conn = DriverManager.getConnection(url, username, password);
            //System.out.println("Connected");
            return conn;
        }catch (Exception e){System.out.println(e);}
        return null;
    }

    public Card getData(String name) throws Exception {
        if(name.equals("Please ensure:The card is placed on a white background.")){
            return new Card("NOCARD", 0, "NONE");
        }
        String sql = "SELECT DISTINCT name, manaCost, manaValue, colors FROM cards WHERE name = " + name;
        Connection connection = getConnection();
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(sql);

        int cmc = 0;
        String color = "";
        while (resultSet.next()){
            cmc = (int)Double.parseDouble(resultSet.getString("manaValue"));
            color = resultSet.getString("colors");
        }
        connection.close();

        return new Card(name, cmc, color);
    }

    public void addCard(Card card) throws Exception {
        if(card.name.equals("\'Please ensure:The card is placed on a white background.\'")){
            System.out.println("card not detected");
            return;
        }
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDateTime now = LocalDateTime.now();
        String Date = dtf.format(now);
        Connection connection = getConnection();
        String sql = "INSERT INTO `inventory` (name, container, date) VALUES (" + card.name + ", " + getBox(card) + ", " + Date + ")";
        Statement statement = connection.createStatement();
        statement.executeUpdate(sql);
        connection.close();
        System.out.println("Card Added");
    }

    public String getBox(Card card){
        String out = "";
        out = Integer.toString(getColor(card.colors));
        return out;
    }

    public int getColor(String colors){
        int out = 0;
        if(colors == null){
            colors = "null";
        }
        switch (colors){
            case "W":
                out = 1;
                break;
            case "U":
                out = 2;
                break;
            case "B":
                out = 3;
                break;
            case "R":
                out = 4;
                break;
            case "G":
                out = 5;
                break;
            case "null":
                out = 6;
                break;
            default:
                out = 7;
                break;
        }
        return out;
    }
}
