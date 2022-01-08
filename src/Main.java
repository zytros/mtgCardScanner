import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws Exception {
        Scryfall sf = new Scryfall();
        VisualInput vi = new VisualInput();
        DataManagement dm = new DataManagement();
        Double p = sf.getPrice(sf.getJSONData("breena, the demagogue", ""));
        Scanner sc = new Scanner(System.in);
        System.out.println(p);
    }

}
