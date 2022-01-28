package repositories

import (
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/sheodox/wellread/db"
)

type ReadingHistoryEntity struct {
	Id          int       `db:"id"`
	VolumeId    int       `db:"volume_id"`
	CurrentPage int       `db:"current_page"`
	CreatedAt   time.Time `db:"created_at"`
}

type ReadingHistoryRepository struct {
	db *sqlx.DB
}

func NewReadingHistoryRepository() *ReadingHistoryRepository {
	return &ReadingHistoryRepository{db.Connection}
}

func (r *ReadingHistoryRepository) List(volumeId int) ([]ReadingHistoryEntity, error) {
	history := []ReadingHistoryEntity{}

	err := r.db.Select(&history, "select * from reading_history where volume_id=$1 order by created_at desc", volumeId)

	return history, err
}

func (r *ReadingHistoryRepository) Add(volumeId, currentPage int) error {
	_, err := r.db.Exec("insert into reading_history (volume_id, current_page, created_at) values ($1, $2, $3)", volumeId, currentPage, time.Now())
	return err
}

func (r *ReadingHistoryRepository) Delete(id int) error {
	_, err := r.db.Exec("delete from reading_history where id=$1", id)
	return err
}
