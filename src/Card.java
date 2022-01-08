public class Card {
    public String name;
    public int cmc;
    public String colors;
    public String expansion;
    public double price;

    public Card(String name, int cmc, String colors, String expansion, double price){
        this.cmc = cmc;
        this.name = name;
        this.colors = colors;
        this.expansion = expansion;
        this.price = price;
        //refresh();
    }

    public Card(String name, int cmc, String colors) {
        this.name = name;
        this.cmc = cmc;
        this.colors = colors;
    }

    @Override
    public String toString() {
        return "Card{" +
                "name='" + name + '\'' +
                ", cmc=" + cmc +
                ", colors='" + colors + '\'' +
                '}';
    }

    private void refresh(){
        colors = colors.replace('\'', ' ');
        name = name.replace('\'', ' ');
    }


}
