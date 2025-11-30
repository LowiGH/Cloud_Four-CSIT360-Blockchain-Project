package edu.cit.csit360.UserRepo;
import edu.cit.csit360.UserEntity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Long> {
    /**
     * Retrieves a list of transactions filtered by the specified type.
     *
     * @param type the type of transactions to search for
     * @return a list of transactions matching the given type
     */
    List<Transaction> findByType(String type);
    List<Transaction> findByStatus(String status);
    List<Transaction> findByOwnerWallet(String ownerWallet);
    List<Transaction> findByOrderByTimestampDesc();
}