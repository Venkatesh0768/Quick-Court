package org.example.quickcourtbackend.controllers;

import org.example.quickcourtbackend.models.User;
import org.example.quickcourtbackend.services.UserServices;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = {"https://quick-court.vercel.app" , "http://localhost:3000"} , allowCredentials = "true")
public class UserController {

    private final UserServices userServices;

    public UserController(UserServices userServices) {
        this.userServices = userServices;
    }


    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userServices.getAllUsers();
        return new ResponseEntity<>(users , HttpStatus.OK);
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<User> getUserById(@PathVariable String user_id) {
        Optional<User> user = userServices.getUserById(user_id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{user_id}")
    public ResponseEntity<User> updateUser(@PathVariable String user_id, @RequestBody User user) {
        Optional<User> updatedUser = userServices.updateUser(user_id, user);
        return updatedUser.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{user_id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String user_id) {
        boolean deleted = userServices.deleteUser(user_id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
