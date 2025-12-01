package edu.cit.csit360.UserController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.cit.csit360.UserEntity.Transaction;
import edu.cit.csit360.UserService.TransactionService;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {
    @Autowired
    private TransactionService service;
    
    // Get all transactions
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return service.getAllTransactions();
    }
    
    // Get transaction by ID
    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return service.getTransactionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Get transactions by type (Send/Receive)
    @GetMapping("/type/{type}")
    public List<Transaction> getTransactionsByType(@PathVariable String type) {
        return service.getTransactionsByType(type);
    }
    
    // Get transactions by status (Confirmed/Pending/Failed)
    @GetMapping("/status/{status}")
    public List<Transaction> getTransactionsByStatus(@PathVariable String status) {
        return service.getTransactionsByStatus(status);
    }
    
    // Get transactions by wallet address
    @GetMapping("/wallet/{wallet}")
    public List<Transaction> getTransactionsByWallet(@PathVariable String wallet) {
        return service.getTransactionsByWallet(wallet);
    }
    
    // Create new transaction
    @PostMapping
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return service.createTransaction(transaction);
    }
    
    // Get transaction history for a user
    @GetMapping("/users/{userId}/history")
    public List<Transaction> getUserTransactionHistory(@PathVariable Long userId) {
        return service.getUserTransactionHistory(userId);
    }
    // Update transaction
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id, 
            @RequestBody Transaction transactionDetails) {
        try {
            Transaction updated = service.updateTransaction(id, transactionDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        service.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
