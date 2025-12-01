package edu.cit.csit360.UserService;
import java.util.List;
import java.util.Optional;
import java.util.Collections;
import java.util.Comparator;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.cit.csit360.UserEntity.Transaction;
import edu.cit.csit360.UserEntity.AuditHistory;
import edu.cit.csit360.UserRepo.TransactionRepo;
import edu.cit.csit360.UserRepo.UserRepo;
import edu.cit.csit360.Utils.AddressUtils;
import edu.cit.csit360.UserEntity.UserEntity;

    @Service
public class TransactionService {
    
    @Autowired
    private TransactionRepo repository;

    @Autowired
    private HistoryService historyService;

    @Autowired
    private UserRepo userRepository;
    
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
        if (wallet == null) return List.of();
        String norm = AddressUtils.normalize(wallet);
        return repository.findByOwnerWallet(norm);
    }
    
    public Transaction createTransaction(Transaction transaction) {
        if (transaction.getTxHash() == null || transaction.getTxHash().isEmpty()) {
            transaction.setTxHash(generateTxHash());
        }
        // normalize owner wallet before saving so records match queries
        transaction.setOwnerWallet(AddressUtils.normalize(transaction.getOwnerWallet()));
        Transaction saved = repository.save(transaction);

        // create audit history entry for the transaction
        try {
            AuditHistory entry = new AuditHistory();
            entry.setUserId(null);
            entry.setOwnerWallet(saved.getOwnerWallet());
            entry.setAction("Transaction created");
            entry.setDetails(String.format("%s %s ADA %s %s", saved.getType(), saved.getAmount(), saved.getToAddress() != null ? "to:"+saved.getToAddress() : "", saved.getTxHash()));
            historyService.save(entry);
        } catch (Exception e) {
            // don't fail transaction if history logging fails
            System.err.println("Failed to write audit history: " + e.getMessage());
        }
        return saved;
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
        transaction.setOwnerWallet(AddressUtils.normalize(transaction.getOwnerWallet()));

        Transaction updated = repository.save(transaction);

        try {
            AuditHistory entry = new AuditHistory();
            entry.setUserId(null);
            entry.setOwnerWallet(updated.getOwnerWallet());
            entry.setAction("Transaction updated");
            entry.setDetails("id:" + updated.getId() + " status:" + updated.getStatus());
            historyService.save(entry);
        } catch (Exception e) { System.err.println("Failed to write audit history: " + e.getMessage()); }

        return updated;
    }
    
    public void deleteTransaction(Long id) {
        // try to capture details for audit before deletion
        repository.findById(id).ifPresent(tx -> {
            try {
                AuditHistory entry = new AuditHistory();
                entry.setUserId(null);
                entry.setOwnerWallet(tx.getOwnerWallet());
                entry.setAction("Transaction deleted");
                entry.setDetails("id:" + tx.getId() + " txHash:" + tx.getTxHash());
                historyService.save(entry);
            } catch (Exception e) { System.err.println("Failed to write audit history: " + e.getMessage()); }
        });
        repository.deleteById(id);
    }
    
    private String generateTxHash() {
        return java.util.UUID.randomUUID().toString().replace("-", "");
    }

    public List<Transaction> getUserTransactionHistory(Long userId) {
        if (userId == null) return Collections.emptyList();
        return userRepository.findById(userId)
                .map(UserEntity::getOwnerWallet)
                .map(wallet -> repository.findByOwnerWallet(wallet))
                .map(list -> list.stream()
                        .sorted(Comparator.comparing(Transaction::getTimestamp).reversed())
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }
}
