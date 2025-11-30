package edu.cit.csit360.UserService;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.csit360.UserEntity.Transaction;
import edu.cit.csit360.UserRepo.TransactionRepo;

    @Service
public class TransactionService {
    
    @Autowired
    private TransactionRepo repository;
    
    public List<Transaction> getAllTransactions() {
        return repository.findByOrderByTimestampDesc();
    }
    
    public Optional<Transaction> getTransactionById(Long id) {
        return repository.findById(id);
    }
    
    public List<Transaction> getTransactionsByType(String type) {
        return repository.findByType(type);
    }
    
    public List<Transaction> getTransactionsByStatus(String status) {
        return repository.findByStatus(status);
    }
    
    public List<Transaction> getTransactionsByWallet(String wallet) {
        return repository.findByOwnerWallet(wallet);
    }
    
    public Transaction createTransaction(Transaction transaction) {
        if (transaction.getTxHash() == null || transaction.getTxHash().isEmpty()) {
            transaction.setTxHash(generateTxHash());
        }
        return repository.save(transaction);
    }
    
    public Transaction updateTransaction(Long id, Transaction transactionDetails) {
        Transaction transaction = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        transaction.setType(transactionDetails.getType());
        transaction.setToAddress(transactionDetails.getToAddress());
        transaction.setFromAddress(transactionDetails.getFromAddress());
        transaction.setAmount(transactionDetails.getAmount());
        transaction.setStatus(transactionDetails.getStatus());
        transaction.setMemo(transactionDetails.getMemo());
        
        return repository.save(transaction);
    }
    
    public void deleteTransaction(Long id) {
        repository.deleteById(id);
    }
    
    private String generateTxHash() {
        return java.util.UUID.randomUUID().toString().replace("-", "");
    }
}
