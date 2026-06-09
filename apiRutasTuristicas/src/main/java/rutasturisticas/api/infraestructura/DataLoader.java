package rutasturisticas.api.infraestructura;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;

import rutasturisticas.api.aplicacion.servicios.*;
import rutasturisticas.api.dominio.entidades.*;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private TipoServicio tipoServicio;

    @Autowired
    private PaisServicio paisServicio;

    @Autowired
    private CiudadServicio ciudadServicio;

    @Autowired
    private RutaServicio rutaServicio;

    @Autowired
    private ParadaServicio paradaServicio;

    @Override
    public void run(String... args) {
        Tipo terrestre = findOrCreateTipo("Terrestre");
        Tipo fluvial = findOrCreateTipo("Fluvial");

        Pais colombia = findOrCreatePais("Colombia", "CO");
        Pais francia = findOrCreatePais("Francia", "FR");

        Ciudad medellin = findOrCreateCiudad("Medellín", colombia, new BigDecimal("-75.5636"), new BigDecimal("6.2518"));
        Ciudad paris = findOrCreateCiudad("Paris", francia, new BigDecimal("2.3522"), new BigDecimal("48.8566"));

        Ruta rutaParis = findOrCreateRuta("Ciudad Histórica", paris, fluvial, "Crucero histórico por el Sena");
        Ruta rutaMedellin = findOrCreateRuta("Recorrido Centro", medellin, terrestre, "Ruta por el centro histórico");

        findOrCreateParada(rutaParis, 1, "Embarcadero Torre Eiffel", new BigDecimal("2.2945"), new BigDecimal("48.8584"), 15, "Punto de inicio");
        findOrCreateParada(rutaParis, 2, "Muelle del Museo de Orsay", new BigDecimal("2.3259"), new BigDecimal("48.8600"), 20, "Muelle");
        findOrCreateParada(rutaParis, 3, "Isla de la Cité - Notre Dame", new BigDecimal("2.3499"), new BigDecimal("48.8529"), 25, "Parada central");

        findOrCreateParada(rutaMedellin, 1, "Plaza Principal", new BigDecimal("-75.5650"), new BigDecimal("6.2490"), 10, "Inicio");
        findOrCreateParada(rutaMedellin, 2, "Museo Local", new BigDecimal("-75.5620"), new BigDecimal("6.2520"), 20, "Cultural");

        System.out.println("DataLoader: Datos de ejemplo insertados o encontrados.");
    }

    private Tipo findOrCreateTipo(String nombre) {
        return tipoServicio.listar().stream()
                .filter(tipo -> tipo.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .orElseGet(() -> tipoServicio.agregar(new Tipo(0, nombre)));
    }

    private Pais findOrCreatePais(String nombre, String codigo) {
        return paisServicio.listar().stream()
                .filter(pais -> pais.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .orElseGet(() -> paisServicio.agregar(new Pais(0, nombre, codigo)));
    }

    private Ciudad findOrCreateCiudad(String nombre, Pais pais, BigDecimal longitud, BigDecimal latitud) {
        return ciudadServicio.listar().stream()
                .filter(ciudad -> ciudad.getNombre().equalsIgnoreCase(nombre) && ciudad.getPais().getId() == pais.getId())
                .findFirst()
                .orElseGet(() -> ciudadServicio.agregar(new Ciudad(0, nombre, pais, longitud, latitud)));
    }

    private Ruta findOrCreateRuta(String nombre, Ciudad ciudad, Tipo tipo, String descripcion) {
        return rutaServicio.listarCiudad(ciudad.getId()).stream()
                .filter(ruta -> ruta.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .orElseGet(() -> rutaServicio.agregar(new Ruta(0, nombre, ciudad, tipo, descripcion)));
    }

    private void findOrCreateParada(Ruta ruta, int orden, String nombre, BigDecimal longitud, BigDecimal latitud, Integer tiempo, String descripcion) {
        boolean exists = paradaServicio.listarRuta(ruta.getId()).stream()
                .anyMatch(parada -> parada.getNombre().equalsIgnoreCase(nombre));
        if (!exists) {
            paradaServicio.agregar(new Parada(0, orden, nombre, ruta, longitud, latitud, tiempo, descripcion));
        }
    }
}
